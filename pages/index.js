import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import react from 'react';

const Index=()=> {
const [post, setPost] = React.useState(null)

const baseURL="https://localhost:8000/api/orders?shopname=denscientist.myshopify.com"
React.useEffect(() => {
    axios.get(baseURL, { headers: {'Access-Control-Allow-Origin': '*'}}).then((response) => {
      setPost(response.data);
    });
  }, []);
    return (
    <div>
    <center><h1>Real time data board</h1></center>

      <Card>
        <Card.Img variant="top" src="holder.js/100px160" />
        <Card.Body>
        {post}
          <Card.Title>Activity stream</Card.Title>
          <Card.Text>
            {post.data}.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>

</div>
    );

}

