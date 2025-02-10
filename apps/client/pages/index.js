import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import MsgList from "../components/MsgList";
import { GET_MESSAGES } from "../graphql/messages";
import { GET_USERS } from "../graphql/user";
import { fetcher, QueryKeys } from "../queryClient";

const Home = ({ dehydratedState }) => {
  return (
    <HydrationBoundary state={dehydratedState}>
      <h1>Simple SNS</h1>
      {/* <MsgList messagesFromServer={messages} users={users} /> */}
      <MsgList />
    </HydrationBoundary>
  );
};

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.fetchQuery({
    queryKey: QueryKeys.MESSAGES,
    queryFn: () => fetcher(GET_MESSAGES),
  });
  await queryClient.fetchQuery({
    queryKey: QueryKeys.USERS,
    queryFn: () => fetcher(GET_USERS),
  });
  // const { messages } = await fetcher(GET_MESSAGES);
  // const { users } = await fetcher(GET_USERS);

  return {
    // props: { messages, users },
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

export default Home;
