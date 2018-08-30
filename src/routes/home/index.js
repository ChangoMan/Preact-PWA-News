import { h, Component } from "preact";
import style from "./style";

const apiKey = "e9d9a38191c9443ea6a081de9dd71e20";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      selectedSource: "techcrunch",
      articles: [],
      sources: []
    };
  }

  componentDidMount() {
    this.updateNews(this.state.selectedSource);
    this.updateSources();
  }

  updateNews = async (source = this.state.selectedSource) => {
    try {
      const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
      const json = await res.json();

      this.setState(() => ({
        isLoaded: true,
        articles: json.articles,
        selectedSource: source
      }));
    } catch (error) {
      this.setState(() => ({ error }));
    }
  };

  updateSources = async () => {
    try {
      const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
      const json = await res.json();

      this.setState(() => ({
        sources: json.sources
      }));
    } catch (error) {
      this.setState(() => ({ error }));
    }
  };

  render() {
    const { error, isLoaded, articles } = this.state;
    if (error) {
      return (
        <div className="error">
          <div className="alert alert--error">Error: {error.message}</div>
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={style.home}>
          <div className="site-header">
            <div className="select">
              <select
                value={this.state.selectedSource}
                onChange={e => {
                  this.updateNews(e.target.value);
                }}>
                {this.state.sources.map(source => {
                  return (
                    <option value={source.id} key={source.id}>
                      {source.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <main>
            {articles.map((article, index) => (
              <div className="article" key={index}>
                <h2>
                  <a href={article.url}>{article.title}</a>
                </h2>
                <img src={article.urlToImage} alt="" />
                <p>{article.description}</p>
              </div>
            ))}
          </main>
        </div>
      );
    }
  }
}
