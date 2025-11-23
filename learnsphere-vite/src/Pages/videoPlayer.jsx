import React, { useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './video-player.css';
import { Rewind, FastForward } from 'lucide-react';

const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  function createRewindButton(player) {
    const Button = videojs.getComponent('Button');
    class RewindButton extends Button {
      constructor(player, options) {
        super(player, options);
        this.controlText('Rewind 10s');
        this.addClass('vjs-rewind-button');
        this.el().innerHTML = ReactDOMServer.renderToStaticMarkup(<Rewind className="w-5 h-5" />);
      }
      handleClick() {
        const newTime = Math.max(0, this.player_.currentTime() - 10);
        this.player_.currentTime(newTime);
      }
    }
    videojs.registerComponent('RewindButton', RewindButton);
    player.controlBar.addChild('RewindButton', {}, 0);
  }

  function createForwardButton(player) {
    const Button = videojs.getComponent('Button');
    class ForwardButton extends Button {
      constructor(player, options) {
        super(player, options);
        this.controlText('Forward 10s');
        this.addClass('vjs-forward-button');
        this.el().innerHTML = ReactDOMServer.renderToStaticMarkup(<FastForward className="w-5 h-5" />);
      }
      handleClick() {
        const duration = this.player_.duration() || Infinity;
        const newTime = Math.min(duration, this.player_.currentTime() + 10);
        this.player_.currentTime(newTime);
      }
    }
    videojs.registerComponent('ForwardButton', ForwardButton);
    player.controlBar.addChild('ForwardButton', {}, 2);
  }

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        ...options,
        fluid: false,
        fill: true,
      }, () => {
        createRewindButton(player);
        createForwardButton(player);
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      const currentSrc = player.currentSource()?.src;
      const newSrc = options.sources[0]?.src;
      if (currentSrc !== newSrc) {
        player.src(options.sources);
      }
    }
  }, [options, onReady]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full">
      <div ref={videoRef} className="video-js-container" />
    </div>
  );
};

export default VideoPlayer;
