import { Movie } from "./Movie";

export class MoviesParser {
  constructor(body) {
    this.element = document.createElement('div');
    this.element.insertAdjacentHTML('beforeend', body);
  }

  parse () {
    const list = [];
    this._movies.forEach((_movie) => {
      list.push(
        this._parseMovie(_movie)
      );
    })
    return list;
  }

  get _movies () {
    return this.element.querySelectorAll("search-page-result[slot='movie'] ul[slot='list'] search-page-media-row[skeleton='panel']");
  }

  _parseMovie (data) {
    const title = this._title(data);
    const year = this._attribute(data, "releaseyear");
    const score = this._attribute(data, "tomatometerscore");
    const state = this._attribute(data, "tomatometerstate");
    const url = this._url(data);
    
    return Object.assign(
      new Movie(), {
        title: title,
        year: year,
        score: score,
        state: state,
        url: url
      }
    )
  }

  _titleNode (data) {
    return data.querySelector("a[slot='title']");
  }

  _title (data) {
    return this._titleNode(data).childNodes[0].nodeValue.split("\n")[1].trim();
  }

  _url (data) {
    return this._attribute(this._titleNode(data), "href");
  }

  _attribute (data, attribute) {
    return data.attributes.getNamedItem(attribute).value;
  }
}