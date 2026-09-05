"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

function refreshMessages(): MessageExample[] {
  const getRandomInt = (max: number) =>
    Math.floor(Math.random() * Math.floor(max));

  return Array.from(new Array(20)).map(
    () => messageExamples[getRandomInt(messageExamples.length)]
  );
}

export function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState(() => refreshMessages());

  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    setMessages(refreshMessages());
  }, [value]);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "90vh",
      }}
      ref={ref}
    >
      <CssBaseline />

      {/* Messages list */}
      <List sx={{ px: 2, pt: 2 }}>
        {messages.map(({ primary, secondary, person }, index) => (
          <React.Fragment key={index + person}>
            <ListItemButton
              sx={{
                mb: 2,
                borderRadius: 3,
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt="Profile Picture"
                  src={person}
                  sx={{
                    width: 48,
                    height: 48,
                    border: "2px solid",
                    borderColor: "divider",
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={primary}
                secondary={secondary}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
                secondaryTypographyProps={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              />
            </ListItemButton>
          </React.Fragment>
        ))}
      </List>

      {/* Bottom navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: "hidden",
        }}
        elevation={8}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            bgcolor: "background.paper",
          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

interface MessageExample {
  primary: string;
  secondary: string;
  person: string;
}

const messageExamples: readonly MessageExample[] = [
  {
    primary: "Brunch this week?",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "Birthday Gift",
    secondary: `Do you have a suggestion for a good present for John on his work anniversary?`,
    person: "/static/images/avatar/1.jpg",
  },
  {
    primary: "Recipe to try",
    secondary: "Trying out a new BBQ recipe, might be amazing!",
    person: "/static/images/avatar/2.jpg",
  },
  {
    primary: "Yes!",
    secondary: "I have the tickets to ReactConf this year 🎉",
    person: "/static/images/avatar/3.jpg",
  },
  {
    primary: "Doctor's Appointment",
    secondary: "Rescheduled for next Saturday.",
    person: "/static/images/avatar/4.jpg",
  },
  {
    primary: "Discussion",
    secondary:
      "Menus from bottom app bar open as bottom sheets at higher elevation.",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "Summer BBQ",
    secondary: "Who’s up for a cookout this weekend? Backyard ready 🔥",
    person: "/static/images/avatar/1.jpg",
  },
];
