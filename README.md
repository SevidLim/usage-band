# usage-band

A Claude mod that shows how much of the conversation's context is in use, so a long working session can be handed over before it grows too large.

- Above the prompt it shows a small centred `^`. Click it to open a line with the current context tokens, the 600,000-token threshold, and how much is left. Click `v`, click anywhere outside the band, or send a message, to close it.
- Every message you send gets one line appended with the current usage, so the model in the conversation can read it too. Once usage reaches 600,000 tokens, that line asks the model to check whether one more task fits, and otherwise to update the project document and prepare a handover.

Install in the Claude desktop app: click + next to the prompt box, Plugins, Add marketplace `SevidLim/usage-band`, then Add plugin. The band is drawn in sessions that run on your computer (terminal or desktop surface).

Install in a terminal: `/plugin install usage-band --marketplace SevidLim/usage-band`
