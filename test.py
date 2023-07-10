import requests

def get_chat_response(message):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
    }

    data = {
        'messages': [{'role': 'system', 'content': 'You are a helpful assistant.'},
                     {'role': 'user', 'content': message}],
        'model': 'gpt-3.5-turbo'
    }

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    response_json = response.json()

    # Extract and return the model's response
    try:
        return response_json['choices'][0]['message']['content']
    except:
        return response_json

while True:
    message = str(input("Enter your question"))
    answer = get_chat_response(message)
    print(answer)