### todo

#### server
* send only tile names, fill other info from data folder
* volume-based collision
  * Tiles have an array of entities, sorted by size
  * TIles track their currently filled volume

#### client
* figure out how to stop blessed from messing up my colors
  * https://github.com/embarklabs/neo-blessed/issues/19
  * https://github.com/chjj/blessed/pull/316/files
  * https://github.com/chjj/blessed/issues/315
  * https://stackoverflow.com/questions/46215427/blessed-prompt-is-black-on-black-by-default-how-do-i-style-it/46508070#46508070
  * hopefully changes in the 2nd link work
* dynamic UI size
* configurable colors
* configurable key bindings
  * move key handlers to separate file
* log
* chat
* in-game menu
* inventory
* inspect mode
* render the state
* data folder for tile information
* disconnect on quitting game screen, not whole client