import requests, qrcode, pathlib, subprocess

# suppress SSL warnings
requests.packages.urllib3.disable_warnings()

session = requests.Session()

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=1,
)

# Set the base URL for the API
url = "https://flydigitsforfermi.hopto.org"

# disable SSL verification
session.verify = False

session.headers.update({'Content-Type': 'application/json'})

# get all sensors
models_names = session.get(url + "/model/list").json()

# get all zpt files into ./models/
zpt_files = list(pathlib.Path('./models').glob('**/*.zpt'))

# create placeholder.zpt if it does not exist
if not pathlib.Path('./models/placeholder.zpt').exists():
    with open('./models/placeholder.zpt', 'w') as f:
        f.write('')

to_update = []
# iterate over list of sensors and check if the corresponding png file exists
for model_name in models_names:
    if not pathlib.Path('./models/images/' + model_name + '.png').exists():
        print("Missing png file for sensor: " + model_name)
        to_update.append(model_name.split('.')[0])
        qr.clear()
        qr.add_data(model_name)
        qr.make(fit=True)
        qr.make_image(fill_color="black", back_color="white").save("models/images/" + model_name + ".png")

# get all png files into ./models/images
png_files = list(pathlib.Path('./models/images').glob('**/*.png'))

# iterate over list of png files and check if the corresponding sensor exists
for png_file in png_files:
    if not pathlib.Path('./models/' + png_file.stem + '.zpt').exists() or png_file.stem in to_update:
        print("Missing sensor for png file: " + png_file.stem)
        with open('./models/' + png_file.stem + '.zpt', 'w') as f:
            # execute zapworks-cli to create a {png_file.stem}.zpt file
            print("Creating sensor for png file: " + png_file.stem)
            subprocess.run(['zapworks', 'train', './models/images/' + png_file.stem + '.png', '-o', './models/' + png_file.stem + '.zpt'])

# print "Done!" in green
print("\033[92mDone!\033[0m")