import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface ArtworkInvitationEmailProps {
  username: string
  eventName: string
  email: string
	location: string
	dateTime: string
}

export const ArtworkInvitationEmail = ({
  username,
  eventName,
  email,
	location,
	dateTime,
}: ArtworkInvitationEmailProps) => {
  const previewText = `Join us on ${eventName} at ${location} (${dateTime})`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join us on <strong>{eventName}</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>You</strong> (
              <Link
                href={`mailto:${email}`}
                className="text-blue-600 no-underline"
              >
                {email}
              </Link>
              ) are invited to join us on art event <strong>{eventName}</strong>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Show this email to enter the event
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ArtworkInvitationEmail;
