var React = require("react");

class New extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
        <h1>New User</h1>
          <form method="POST" action="/users">
            <div>
              Name:<input name="name" type="text" placeholder="Name" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = New;
