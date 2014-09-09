Package.describe({
	summary: 'Crypto Mode Package for CryptoJS, standard secure algorithms',
	version: '3.1.2',
	git: 'https://github.com/p-j/meteor-crypto-mode.git'
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@0.9.1.1');
	api.use('jparker:crypto-core@3.1.2', ['client', 'server']);
	api.use('jparker:crypto-cipher-core@3.1.2', ['client', 'server']);
	api.imply('jparker:crypto-core', ['client', 'server']);
	api.imply('jparker:crypto-cipher-core', ['client', 'server']);

	api.addFiles([
		'lib/mode-cfb.js',
		'lib/mode-ctr-gladman.js',
		'lib/mode-ctr.js',
		'lib/mode-ecb.js',
		'lib/mode-ofb.js'
	], ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jparker:crypto-mode');
  api.use('jparker:crypto-aes');
  api.addFiles('tests/tests.js');
});
