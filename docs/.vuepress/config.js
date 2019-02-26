module.exports = {
	base: '/aloes-handlers/',
	dest: 'public',
	themeConfig: {
		logo: '/assets/img/logo.png',
		nav: [{text: 'Home', link: '/'}, {text: 'API', link: '/api/'}],
		sidebar: [
			'/',
			['/api/', 'Handlers'],
			['/aloesclient/', 'AloesClient'],
			['/aloeslight/', 'AloesLight'],
			['/cayennelpp/', 'CayenneLPP'],
			['/mysensors/', 'MySensors'],
		],
	},
	siteTitle: 'Aloes - Handlers',
	title: 'Aloes - Handlers',
	description: 'Encode / decode MQTT stream from IoT devices to Web browsers.',
	lang: 'en-US',
	home: 'true',
	heroImage: '/aloes-handlers/assets/img/logo.png',
	actionText: 'Docs →',
	actionLink: '/api/',
	footer: 'Getlarge',
};
