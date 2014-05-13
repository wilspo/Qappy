#!/usr/local/bin/fish

tmux new-session -s Qappy -d
tmux split-window -h -p 50 -t Qappy
tmux select-pane -t 1	
tmux split-window -v -p 50 -t Qappy
tmux select-pane -t 3
tmux split-window -v -p 50 -t Qappy

tmux send-keys -t Qappy:1.1 "gulp watch-ts" C-m
tmux send-keys -t Qappy:1.3 "gulp watch" C-m
tmux send-keys -t Qappy:1.4 "gulp express" C-m

tmux attach -t Qappy