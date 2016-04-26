# Winky

This is a simple application that runs in the terminal and integrates with the Wink API  

**note: this is not meant to replace the wink app, home assistant, or openhab. I wanted to learn typescript and play with the wink api.**  

## To use:
- Install node (version that can run es6)
- Run 'node dist/app.js'
- If you do not have a valid config, it will prompt you for username/password  
  **note: it does not save username/password, it uses them to obtain an oauth access and refresh token and saves those**

Key Mapping:
- 'd'     - set focus to device table
- 'r'     - set focus to robot table
- 'g'     - set focus to group table
- 'y'     - refresh data
- 'enter' - will toggle device state, currently only works for lights