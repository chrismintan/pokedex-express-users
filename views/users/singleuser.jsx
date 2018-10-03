var React = require('react');

class singleuser extends React.Component {
  render() {

    const user = this.props.user.map( (user) => {

        var actionURL = '?_method=PUT'+'&&'+'id=' + user.id;

        return (
            <li>{user.id}. {user.name}<img src={user.img}/> Caught: {user.caught}<form method="POST" action={actionURL}><input type="submit" value="Capture!"/></form><br/></li>
            )
    })

    return (
      <div>
        <h1>Pokedex Progress</h1>
        <ul>
            {user}
        </ul>
      </div>
    );
  }
}

module.exports = singleuser;