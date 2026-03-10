import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

/**
 * @type {import('aws-amplify/data').Client<import('../../amplify/data/resource').Schema>}
 */
const client = generateClient({
  authMode: "userPool",
});

function ProfileContent({ signOut, user }) {
  const [userprofiles, setUserProfiles] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    if (!client.models?.UserProfile) {
      console.error("UserProfile model is missing from Amplify client");
      return;
    }

    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My Profile</Heading>
      <Divider />

      <View margin="2rem 0">
        <Heading level={3}>
          Signed in as: {user?.signInDetails?.loginId || user?.username || "Unknown user"}
        </Heading>
      </View>

      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <ProfileContent signOut={signOut} user={user} />}
    </Authenticator>
  );
}