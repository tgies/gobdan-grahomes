# server.py
from flask import Flask, request, jsonify, send_file
from openai import OpenAI
import os
import logging
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

openai = OpenAI()

# Configure OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def atbash_decode(encoded_text):
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    reversed_alphabet = alphabet[::-1]
    return encoded_text.translate(str.maketrans(alphabet + alphabet.upper(), reversed_alphabet + reversed_alphabet.upper()))

@app.route('/')
def index():
    return send_file('src/index.html')

@app.route('/api/encode', methods=['POST'])
def encode():
    logging.debug('Encode endpoint called')  # Log entry point
    data = request.get_json()
    logging.debug(f'Received data: {data}')  # Log received data
    user_message = data.get('message')
    temperature = float(data.get('temperature', 0.7))
    top_p = float(data.get('top_p', 0.9))

    # Use OpenAI API to encode using Atbash
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Reply with the user's message encoded in Atbash."},
            {"role": "user", "content": user_message}
        ],
        temperature=temperature,
        top_p=top_p
    )
    encoded_message = response.choices[0].message.content.strip()

    # Decode using local Atbash decoder
    decoded_message = atbash_decode(encoded_message)

    logging.debug(f'Encoded message: {encoded_message}')  # Log encoded message
    logging.debug(f'Decoded message: {decoded_message}')  # Log decoded message

    return jsonify({'encoded': encoded_message, 'decoded': decoded_message})

@app.route('/api/decode', methods=['POST'])
def decode():
    logging.debug('Decode endpoint called') 
    data = request.get_json()
    logging.debug(f'Received data: {data}')  # Log received data
    encoded_message = data.get('encodedMessage')
    temperature = float(data.get('temperature', 0.7))
    top_p = float(data.get('top_p', 0.9))

    # Use OpenAI API to decode Atbash
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Reply with the decoding of the user's Atbash-encoded message."},
            {"role": "user", "content": encoded_message}
        ],
        temperature=temperature,
        top_p=top_p
    )
    decoded_message = response.choices[0].message.content.strip()

    logging.debug(f'Decoded message: {decoded_message}') 

    return jsonify({'decoded': decoded_message})

if __name__ == '__main__':
    app.run()
