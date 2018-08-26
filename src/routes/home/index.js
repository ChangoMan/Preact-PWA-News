import { h, Component } from 'preact';
import style from './style';

const apiKey = "e9d9a38191c9443ea6a081de9dd71e20";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			selectedSource: 'the-washington-post',
			articles: [],
			sources: []
		};
	}

	componentDidMount() {
		this.updateNews(this.state.selectedSource);
		this.updateSources();
	}

	updateNews = (source) => {
    fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`)
    .then(res => res.json())
    .then((result) => {
      this.setState(() => ({
        isLoaded: true,
        articles: result.articles,
        selectedSource: source
      }));
    }, (error) => {
      this.setState(() => ({error}))
    })
  }

	updateSources = () => {

    fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
    .then(res => res.json())
    .then((result) => {
      this.setState(() => ({
        sources: result.sources
      }));
    }, (error) => {
      this.setState(() => ({error}))
    })
  }

	render() {
		const { error, isLoaded, articles } = this.state;
		if (error) {
		  return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
		  return <div>Loading...</div>;
		} else {
		  return (
			<div className={style.home}>
				<header className="site-header">
					<select value={this.state.selectedSource} onChange={(e) => {this.updateNews(e.target.value)}}>
						{this.state.sources.map((source) => {
						return <option value={source.id} key={source.id}>{source.name}</option>
						})}
					</select>
				</header>

			  <main>
				{articles.map((article, index) => (
				  <div className="article" key={index}>
					<h2><a href={article.url}>{article.title}</a></h2>
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
