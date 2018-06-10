import React from 'react';
import axios from 'axios';
import Login from '../components/Login';


export default class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      global_recipes: []
    };
  }


  componentWillMount() {
    let { appState } = this.props;

    let userId = appState.currentUser.user_id;
    this.getGlobalRecipes(userId);
  }

  getGlobalRecipes(userId) {
    axios.post('/api/get_global_recipes', {
      user_id: userId
    })
    .then((response) => {

      if(response.data.length) {
        this.setState({
          global_recipes: response.data
        });
      }
    });
  }

  renderRecipesList() {
    let recipes = this.state.global_recipes;

    if(recipes.length > 0) {
      return recipes.map((recipe, idx) => {
        recipe.ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients;
        recipe.instructions = typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions;
        return this.renderRecipe(recipe, idx);
      });
    }
    else return null;
  }

  renderRecipe(recipe, idx) {
    return (
      <li key={idx} class="c-user-recipes__list-item">
        <div class="c-user-recipes__left">
          <strong>{recipe.name}</strong>
          <img src={recipe.recipe_image} alt={recipe.name} />
          <p>Cooking Time: {recipe.cooking_time}</p>
          <p>Serving Size: {recipe.serving_size}</p>
          <p>Description: {recipe.blurb}</p>
        </div>
        <div class="c-user-recipes__right">
          <div class="c-user-recipes__actions">
            <a onClick={ this.handleAddToCookbook.bind(this, recipe.recipe_id, idx) } href="#">Add To Cookbook</a>
          </div>
          <ul class="c-ingredient-list">
            { this.renderIngredientList(recipe.ingredients) }
          </ul>
          <ol class="c-instruction-list">
            { this.renderInstructionsList(recipe.instructions) }
          </ol>
        </div>
      </li>
    );
  }

  handleAddToCookbook(recipe_id) {
    let user_id =  this.props.appState.currentUser.user_id;
    axios.post('/api/add_follower_to_recipe', {
      recipe_id,
      follower_id: user_id
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      throw err;
    })
  }

  renderIngredientList(ingredients) {
    if(ingredients !== null && ingredients.length > 0) {
      return ingredients.map((ingredient, idx) => {
        return (
          <li key={idx} class="c-ingredient">
            <span>{ingredient.name}</span>
            <span>{ingredient.quantity}</span>
          </li>
        )
      });
    }
    else return null;
  }

  renderInstructionsList(instructions) {
    if(instructions !== null && instructions.length > 0) {
      return instructions.map((step, idx) => {

        return (
          <li key={idx} class="c-instruction">
            <p>{step}</p>
          </li>
        )
      });
    }
    else return null;
  }



  render() {
    let { appState, updateAppState } = this.props;

    if(appState.loggedIn) {
      return (
        <div class="c-explore">
          <h1> Explore Page! </h1>
          <div class="c-explore__recipes">
            {this.renderRecipesList()}
          </div>
        </div>
      );
    }
    else {
      return <Login updateAppState={updateAppState.bind(this)} />;
    }
  }

}
