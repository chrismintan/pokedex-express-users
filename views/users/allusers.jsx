var React = require('react');

class allusers extends React.Component {
  render() {

    const users = this.props.users.map( (users) => {

        var link = "/users/" + users.name;

        // let linkPath = "/dog/new?owner_id="+owner.id;

        return (<li>
                {users.id}. {users.name}
                <br/><a href={link}>View Pokemon Caught</a><br/><br/>
            </li>);

    });

    return (
      <div>
        <h1>All Users</h1>
        <ul>
            {users}
        </ul>
      </div>
    );
  }
}

module.exports = allusers;