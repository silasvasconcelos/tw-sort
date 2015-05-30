from flask import Flask, render_template, request, make_response, redirect, url_for
from settings import APP_KEY, APP_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET
from TwitterSearch import *
import json

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

@app.route('/get-twitters/', methods=['GET'])
def get_twitters():

	twitters = []
	tags = request.args.get('hashtags',False).replace('#','%23').replace('@','%40').replace(' ','').split(',')

	try:
		if len(tags)>=1:
			search_settings = TwitterSearchOrder() # create a TwitterSearchOrder object
			search_settings.set_include_entities(False) # and don't give us all those entity information
			search_settings.set_keywords( tags ) # let's define all words we would like to have a look for

			# it's about time to create a TwitterSearch object with our secret tokens
			search_on_twitter = TwitterSearch(
				consumer_key = APP_KEY,
				consumer_secret = APP_SECRET,
				access_token = OAUTH_TOKEN,
				access_token_secret = OAUTH_TOKEN_SECRET
			)
			# this is where the fun actually starsearch_on_twitter :)
			for twitter in search_on_twitter.search_tweets_iterable(search_settings):
				tw = { 'text' : twitter['text'], 'profile_image_url' : twitter['user']['profile_image_url'], 'name' : twitter['user']['name'], 'screen_name' : twitter['user']['screen_name'], 'location' : twitter['user']['location'] }
				if tw not in twitters:
					twitters.append( tw )
			# return json
			return json.dumps(twitters)
		else:
			return json.dumps([])
			
	except TwitterSearchException as e: # take care of all those ugly errors if there are some
		return json.dumps([])
		# return {'msg':'Desculpa, houve um erro no servidor', 'class':'alert alert-warning'}

@app.errorhandler(404)
def page_not_found(error):
	return render_template('page_not_found.html'), 404


if __name__ == '__main__':
	app.run( debug=True )