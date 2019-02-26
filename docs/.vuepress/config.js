module.exports = {
	base: '/',
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
};
