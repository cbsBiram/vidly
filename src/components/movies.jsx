import React, { Component } from "react";
import { toast } from "react-toastify";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagination from "./common/pagination";
import { paginate } from "./utils/paginate";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import { getGenres } from "../services/genreService";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./searchBox";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data: results } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...results];
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    let movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been deleted");
        this.setState({ movies: originalMovies });
      }
    }
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  renderPageData = () => {
    const {
      currentPage,
      pageSize,
      movies: allMovies,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);
    const ordered = _.orderBy(filtered, sortColumn.path, sortColumn.order);
    const movies = paginate(ordered, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { currentPage, pageSize, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, data: movies } = this.renderPageData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <div className="table-responsive">
            {user && (
              <div className="new-movie">
                <Link to="/movies/new" className="btn btn-primary">
                  New Movie
                </Link>
              </div>
            )}
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <p>
              <strong>Showing {totalCount} movies on this page</strong>
            </p>
            <MoviesTable
              sortColumn={sortColumn}
              movies={movies}
              onSort={this.handleSort}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
            />
          </div>
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
