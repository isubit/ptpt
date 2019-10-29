const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, './src');
const MODULES_DIR = path.resolve(__dirname, './node_modules');

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;
  
// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});

const config = {
	context: path.resolve(__dirname, './'),
	mode: 'development',
	entry: APP_DIR + '/app.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	devServer:{
		contentBase: BUILD_DIR,
		historyApiFallback: true,
		allowedHosts: [
			'.ngrok.io'
		]
	},
	module : {
		noParse: [/node_modules\/mapbox-gl\/dist\/mapbox-gl.js/],
		rules: [
			{
				test: /\.jsx?/,
				include: APP_DIR,
				loader: 'babel-loader',
				query: {
					presets: ['@babel/preset-env', '@babel/preset-react'].map(require.resolve),
					plugins: ['@babel/plugin-proposal-class-properties'].map(require.resolve)
				}
			},
			{
				test: /\.json?/,
				include: APP_DIR,
				loader: 'json'
			},
			{
				test: /\.sass$/,
				include: APP_DIR,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.css$/,
				include: APP_DIR,
				loaders: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|eot|woff|woff2|ttf)$/,
				include: [APP_DIR, MODULES_DIR],
				loaders: ['url-loader?limit=50000&name=[path][name].[ext]']
			},
			{
				test: /\.svg(\?.*)?$/,
				include: APP_DIR,
				loaders: [ 'url-loader', 'svg-transform-loader']
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin(envKeys)
	],
	resolve: {
		modules: [MODULES_DIR, APP_DIR]
	},
	node: {
		fs: 'empty'
	}
};

module.exports = config;