Package.describe({
	summary: 'Crypto Mode Package for CryptoJS, standard secure algorithms',
	version: '0.1.1',
	git: 'https://github.com/p-j/meteor-crypto-mode.git'
});

Package.onUse(function (api) {
	api.versionsFrom('METEOR@0.9.1.1');

	api.use([
    'jparker:crypto-core@0.1.0',
		'jparker:crypto-cipher-core@0.1.0'
  ], ['client', 'server']);

	api.imply([
    'jparker:crypto-core',
		'jparker:crypto-cipher-core'
  ], ['client', 'server']);

	api.addFiles([
		'lib/mode-cfb.js',
		'lib/mode-ctr-gladman.js',
		'lib/mode-ctr.js',
		'lib/mode-ecb.js',
		'lib/mode-ofb.js'
	], ['client', 'server']);
});

Package.onTest(function (api) {
	api.use([
    'jparker:crypto-core@0.1.0',
    'jparker:crypto-cipher-core@0.1.0',
    'jparker:crypto-mode@0.1.0',
  	'jparker:crypto-aes@0.1.0',
  	'tinytest'
  ], ['client', 'server']);

	api.addFiles('tests/tests.js', ['client', 'server']);
});