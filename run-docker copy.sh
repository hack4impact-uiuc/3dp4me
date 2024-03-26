docker build -t 3dp4me . && docker run -e DOPPLER_TOKEN="$DOPPLER_TOKEN" -p 8080:8080 --name 3dp4me 3dp4me
