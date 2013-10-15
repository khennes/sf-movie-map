from pygeocoder import Geocoder, GeocoderError
import json
import sys
import urllib2


def geocode_locations(filename):

    # bias location search results to SF
    # coordinates courtesy of http://jsfiddle.net/yV6xv/16/
    BOUNDS = ((37.693601037244406, -122.51541137695312), (37.83419172060043, -122.35542297363281))

    json_file = open(filename)
    data = json.load(json_file)
    print len(data)
    errors = []

    for scene in data:
        if scene.get('latlong') != None:
            continue
        try:
            results = Geocoder.geocode(scene['locations'], bounds=BOUNDS)
            if not 37.0 < results[0].coordinates[0] < 38.0 or not -123.0 < results[0].coordinates[1] < -122.0:
                errors.append(scene)
            else:
                scene['latlong'] = results[0].coordinates
        except GeocoderError:
            errors.append(scene)
        except KeyError:
            data.remove(scene)  # remove object from array if it does not have a location field
    
    f = open('static/js/geocoded.json', 'w+')
    updated_json = json.dump(data, f)
    f.close()
    print "errors: ", len(errors)
    print "data: ", len(data)
    errors_list = open('errors_list.txt', 'w+')
    errors_list.write(str(errors))


def main():
    filename = sys.argv[1]
    geocode_locations(filename)

if __name__ == "__main__":
    main()
