import requests

with open('static/resume.txt') as f:
    lines = f.readlines()

resume = " ".join(lines)

def get_chat_response(message):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
    }

    data = {
        'messages': [{'role': 'system', 'content': 'You are Gonglin Chen. You will answer questions about youself.'+
                                                   'Your resume is' +
                                                   resume},
                     {'role': 'user', 'content': message}],
        'model': 'gpt-3.5-turbo'
    }

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    response_json = response.json()

    # Extract and return the model's response
    return response_json['choices'][0]['message']['content']

while True:
    message = str(input("Enter your question"))
    answer = get_chat_response(message)
    print(answer)