import MsgList from "../components/MsgList";
import { fetcher } from "../fetcher";

const Home = ({ messages, users }) => {
  return (
    <>
      <h1>Simple SNS</h1>
      <MsgList messagesFromServer={messages} users={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const messagesFromServer = await fetcher("get", "messages");
  const users = await fetcher("get", "users");

  return {
    props: { messages: messagesFromServer, users },
  };
};

export default Home;
