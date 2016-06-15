require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


let imageDatas = require('../data/imageDatas.json');

imageDatas = (function(imageDatas) {
	for (let i = 0; i < imageDatas.length; i++) {
		let image = imageDatas[i];
		image.url = require('../images/' + image.fileName);
		imageDatas[i] = image;
	}
	return imageDatas;
})();

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec"></section>
      	<nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
