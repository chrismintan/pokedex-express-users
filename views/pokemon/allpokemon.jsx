var React = require('react');

class allpokemon extends React.Component {
  render() {
    console.log(this.props.pokemon)
    const pokemon = this.props.pokemon.map( (pokemon) => {

        var link = "/pokemon/" + pokemon.id;

        // let linkPath = "/dog/new?owner_id="+owner.id;

        return (<li>
                {pokemon.id}. {pokemon.name}
                <img src={pokemon.img}/>
                <br/><a href={link}>View Who Caught</a><br/><br/>
            </li>);

    });

    return (
      <div>
        <h1>All Pokemons</h1>
        <ul>
            {pokemon}
        </ul>
      </div>
    );
  }
}

module.exports = allpokemon;