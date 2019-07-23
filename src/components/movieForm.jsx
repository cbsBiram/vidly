import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "./../services/movieService";

class movieForm extends Form {
  state = {
    data: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
    errors: {},
    genres: []
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .max(1000)
      .required()
      .label("Number In Stock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Daily Rental Rate")
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }
  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      if (movieId === "new") return;
      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }
  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  doSubmit = async () => {
    await saveMovie(this.state.data);
    this.props.history.push("/movies");
  };

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  }

  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number In Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate", "number")}
          {this.renderbutton("Save")}
        </form>
      </div>
    );
  }
}

export default movieForm;
