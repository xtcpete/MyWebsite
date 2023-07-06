from flask import Flask, Response, request, render_template, jsonify, json
from flask_socketio import SocketIO, emit
from utils.tools import *
from flask_caching import Cache
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['CACHE_TYPE'] = 'SimpleCache'
socketio = SocketIO(app, cors_allowed_origins="*")
cache = Cache(app)


"""
Home page
"""


@app.route('/')
@cache.cached(timeout=50)
def index():
    db = MongoDB('root').db
    data_collect = db.get_collection('Main')

    experiences = [d for d in data_collect.find({'_id': "Experiences"}, {"_id": 0, 'data': 1})][0]['data']
    experiences_list = []
    for i in reversed(range(len(experiences))):
        experiences_list.append(experiences[str(i)])

    education = [d for d in data_collect.find({'_id': "Education"}, {"_id": 0, 'data': 1})][0]['data']
    education_list = []
    for i in reversed(range(len(education))):
        education_list.append(education[str(i)])

    info = [d for d in data_collect.find({'_id': "Info"}, {"_id": 0, 'data': 1})][0]['data']

    keySkills = list(map(lambda x: {"label": x, 'url': 'https://www.google.com/search?q='+x.lower()}, info['keySkills'].split(',')))

    projects = [d for d in data_collect.find({'_id': "Projects"}, {"_id": 0, 'data': 1})][0]['data']
    demo_list = []
    nodemo_list = []
    for i in range(len(projects)):
        temp = projects[str(i)]
        if temp['Demo']:
            demo_list.append(temp)
        else:
            nodemo_list.append(temp)

    return render_template("index.html", info=info, experiences=experiences_list,
                           education=education_list, keySkills=keySkills,
                           demo=demo_list, nodemo=nodemo_list)


"""
Admin page
"""


@app.route('/admin')
@cache.cached(timeout=50)
def admin():
    try:
        key = request.args.get('key')
    except:
        return "Unauthorized"

    if key == "xtcpete":
        db = MongoDB('root').db
        collections = db.list_collection_names()
        all_data = {}.fromkeys(collections)
        for collection in collections:
            all_data[collection] = [x for x in db.get_collection(collection).find()]
        return render_template("admin.html", all_data=all_data)
    else:
        return "Unauthorized"

@app.route('/admin/<path:myPath>', methods=['PUT'])
def admin_put(myPath):
    return catch_all_put(db='root', socketio=socketio)


@app.route('/admin/<path:myPath>', methods=['GET'])
def admin_get(myPath):
    return catch_all_get(db='root', socketio=socketio)


@app.route('/admin/<path:myPath>', methods=['POST'])
def admin_post(myPath):
    return catch_all_post(db='root', socketio=socketio)


@app.route('/admin/<path:myPath>', methods=['DELETE'])
def admin_delete(myPath):
    return catch_all_delete(db='root', socketio=socketio)


@app.route('/admin/<path:myPath>', methods=['PATCH'])
def admin_patch(myPath):
    return catach_all_patch(db='root', socketio=socketio)


"""
Experiences
"""


@app.route('/experience')
@cache.cached(timeout=50)
def redirect():
    return redirect('/')


@app.route('/experience/<path:myPath>')
@cache.cached(timeout=50)
def catch_all_experience(myPath):
    db = MongoDB('root').db
    data_collect = db.get_collection('Detail')
    cursor = data_collect.find({'_id': myPath})
    data = [d for d in cursor][0]['data']
    _id = data['id']

    main_collect = db.get_collection('Main')
    joined_key = 'data.'+_id

    cursor = main_collect.find({'_id': "Experiences", joined_key:{"$exists": True}}, {joined_key:1})
    summary = [d for d in cursor][0]['data'][_id]
    return render_template('experiences.html', data=data, summary=summary)


"""
Demo - WaterBase
"""


@app.route('/WaterBase')
def WaterBase():
    db = MongoDB('demo').db
    collections = db.list_collection_names()
    all_data = {}.fromkeys(collections)
    for collection in collections:
        all_data[collection] = [x for x in db.get_collection(collection).find()]
    return render_template("demo/WaterBase.html", all_data=all_data)


@app.route('/WaterBase/<path:myPath>', methods=['PUT'])
@cache.cached(timeout=50)
def demo_put(myPath):
    return catch_all_put(db='demo', socketio=socketio)

@app.route('/WaterBase/<path:myPath>', methods=['GET'])
def demo_get(myPath):
    return catch_all_get(db='demo', socketio=socketio)

@app.route('/WaterBase/<path:myPath>', methods=['POST'])
def demo_post(myPath):
    return catch_all_post(db='demo', socketio=socketio)


@app.route('/WaterBase/<path:myPath>', methods=['DELETE'])
def demo_delete(myPath):
    return catch_all_delete(db='demo', socketio=socketio)


@app.route('/WaterBase/<path:myPath>', methods=['PATCH'])
def demo_patch(myPath):
    return catach_all_patch(db='demo', socketio=socketio)

if __name__ == '__main__':
    socketio.run(app, debug=True)