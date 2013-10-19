import sys
import urllib2
import re
import json
from pygeocoder import Geocoder, GeocoderError


def geocode_locations(filename):

    # bias location search results to SF
    # coordinates courtesy of http://jsfiddle.net/yV6xv/16/
    BOUNDS = ((37.75334401310656, -122.45498657226562), (37.811411388625636, -122.39181518554688))

    json_file = open(filename)
    data = json.load(json_file)

    # debugging
    errors = 0
    address_string = ''

    for scene in data:
        if scene.get('latlong') != None:
            continue
        else:
            try:
                if u'\xe9' in scene['locations']:  # filter for most common unicode error
                    scene['locations'] = scene['locations'].replace(u'\xe9', 'e')

                # to capture actual addresses (usually in parens = more accurate search string)
                if '(' in scene['locations']:
                    address_string = re.search('\((.*?)\)', scene['locations']).group(1)
                else:
                    address_string = scene['locations']

                results = Geocoder.geocode(str(address_string), bounds=BOUNDS)

                # check that resulting coordinates are within vicinity of SF
                if not 37.0 < results[0].coordinates[0] < 38.0 or not -123.0 < results[0].coordinates[1] < -122.0:
                    if len(results) > 1:
                        for i in range(1, len(results)):
                            if 37.0 < results[i].coordinates[0] < 38.0 and -123.0 < results[i].coordinates[1] < -122.0:
                                scene['latlong'] = results[i].coordinates
                                break
                else:
                    scene['latlong'] = results[0].coordinates
            except GeocoderError:
                errors += 1
                continue
            except KeyError:
                data.remove(scene)  # throw out object if it has no location field
    
    f = open('static/js/geocoded.json', 'w+')
    updated_json = json.dump(data, f)
    f.close()


def main():
    filename = sys.argv[1]
    geocode_locations(filename)

if __name__ == "__main__":
    main()
