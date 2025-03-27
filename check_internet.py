import requests
import time
from datetime import datetime
import csv
import random

# Lista de URLs mais comuns na internet
urls = [
    'http://www.google.com',
    'http://www.youtube.com',
    'http://www.facebook.com',
    'http://www.instagram.com',
    'http://www.wikipedia.org',
    'https://resultados.tse.jus.br/oficial/app/index.html',
    'https://www.tse.jus.br',
    'http://www.linkedin.com',
    'http://www.netflix.com',
    'https://tn3.tse.jus.br'
]

# Dicionário de descrições breves dos códigos HTTP
http_status_descriptions = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    103: "Early Hints",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",
    300301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    306: "(Unused)",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required"
}

def check_internet(url):
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200, response.status_code
    except requests.ConnectionError:
        return False, None

def measure_speed(url):
    start_time = time.time()
    try:
        response = requests.get(url, timeout=5)
        end_time = time.time()
        if response.status_code == 200:
            # Calculate download speed in Kilobytes per second
            content_length = len(response.content) / 1024  # Convert bytes to Kilobytes
            duration = end_time - start_time  # Time taken in seconds
            speed = content_length / duration  # Speed in Kilobytes per second
            return speed, content_length, url, response.status_code
        else:
            return None, None, url, response.status_code
    except requests.ConnectionError:
        return None, None, url, None

# Write the header row once if the file does not exist
with open('check_internet_log.csv', mode='a', newline='') as file:
    writer = csv.writer(file)
    if file.tell() == 0:
        writer.writerow(['Timestamp', 'Status', 'HTTP Status', 'Description', 'Speed (KB/s)', 'Content Length (KB)', 'URL'])

while True:
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    url = random.choice(urls)  # Escolhe uma URL aleatória da lista
    internet_status, http_status = check_internet(url)
    description = http_status_descriptions.get(http_status, "Unknown Status")
    if internet_status:
        speed, content_length, url, http_status = measure_speed(url)
        if speed is not None:
            status = "Internet OK"
            print(f"{current_time} - {status}, HTTP Status: {http_status} ({description}), Speed: {speed:.2f} KB/s, Length: {content_length:.2f} KB, URL: {url}")
            with open('check_internet_log.csv', mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([current_time, status, http_status, description, f"{speed:.2f}", f"{content_length:.2f}", url])
        else:
            status = "Internet OK, but speed not measured"
            print(f"{current_time} - {status}, HTTP Status: {http_status} ({description}), URL: {url}")
            with open('check_internet_log.csv', mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([current_time, status, http_status, description, "", "", url])
    else:
        status = "Internet NOT OK"
        print(f"{current_time} - {status}, HTTP Status: {http_status} ({description}), URL: {url}")
        with open('check_internet_log.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([current_time, status, http_status if http_status is not None else "", description if http_status is not None else "", "", "", url])
    time.sleep(1)  # Espera 1 segundo antes de fazer o próximo teste