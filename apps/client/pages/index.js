import MsgList from "../components/MsgList";
import { fetcher } from "../queryClient";

const Home = ({ messages, users }) => {
  return (
    <>
      <h1>Simple SNS</h1>
      <MsgList messagesFromServer={messages} users={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const messagesFromServer = await fetcher(GET_MESSAGES);
  const users = await fetcher(GET_USERS);

  return {
    props: { messages: messagesFromServer, users },
  };
};

export default Home;
