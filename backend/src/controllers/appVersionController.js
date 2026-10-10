const getAppVersion = (req, res) => {
  res.status(200).json({
    success: true,
    latestVersion: '1.0.1',
    minimumVersion: '1.0.0',
    forceUpdate: false,
    downloadUrl: 'https://rodiotradelink.com/',
    message: 'RodioApp ka naya version available hai.',
  });
};

module.exports = { getAppVersion };