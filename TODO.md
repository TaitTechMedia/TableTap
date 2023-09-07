- Add gitignore for TODO.md and tools directory

- Cache conditions seem to check for /boards url to update the boards, but I need a way to do this with paths. The entire site works
    off the base URL, so there is no boards url. I could just cache the entire site as it is less than a MB. I wonder if I should rethink how this is built though. With current planned funcitonality, we can load in ALL logic and all baords easily, but if we decide to add functionality, this could pose an issue. 
        - Need to look into loading pieces of code only when something is clicked and splitting the needed logic into JS modules that ONLY get loaded when they are needed and unloaded when not needed. Ideally I keep everything small and efficient though, as I want to be able to cache the entire app anyways, but this will help if I decide to implement any online multiplayer or leaderboard functionality that has no business being cached.

- Add a mechanism to add your own games if you have PWA installed and make sure clearing cache, doesn't affect this (including manually
    clearing Chrome cookies)?

- Branding:
    - Define official color pallete
    - Design Logos
        - Large Logo
        - Small Logo
            - Add this to manifest.json
            - Generate a favicon

- UX/UI
    - Add animations to boards opening and closing