import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Nothing found, try another search.';

  _generateMarkup() {
    return this._data.map(res => previewView.render(res, false)).join();
  }
}

export default new ResultsView();
