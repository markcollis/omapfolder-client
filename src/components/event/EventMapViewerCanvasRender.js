import React, { Component } from 'react';
import PropTypes from 'prop-types';
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */

// The EventMapViewerCanvasRender component renders the actual map image and
// detects interactions with it
class EventCourseMapCanvasRender extends Component {
  state = {
    isKeyDown: {},
    isMouseDown: false,
    isMouseOver: false,
    isTouchZoomingIn: false,
    isTouchZoomingOut: false,
    maxPanStep: 10, // pixels
    mouseX: 0,
    mouseY: 0,
    panTimeInterval: 20, // milliseconds
    touchZoomReferenceDistance: 0, // needed to determine whether zooming in or out
  };

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    top: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired,
    scale: PropTypes.number,
    imageSrc: PropTypes.string,
    imageAlt: PropTypes.string,
    isLoading: PropTypes.bool,
    overlays: PropTypes.arrayOf(PropTypes.string).isRequired,
    handlePanImage: PropTypes.func.isRequired,
    switchCourseRoute: PropTypes.func.isRequired,
    startZoomIn: PropTypes.func.isRequired,
    endZoomIn: PropTypes.func.isRequired,
    startZoomOut: PropTypes.func.isRequired,
    endZoomOut: PropTypes.func.isRequired,
    startRotateLeft: PropTypes.func.isRequired,
    endRotateLeft: PropTypes.func.isRequired,
    startRotateRight: PropTypes.func.isRequired,
    endRotateRight: PropTypes.func.isRequired,
  };

  static defaultProps = {
    left: null,
    width: null,
    height: null,
    scale: 1,
    imageSrc: '',
    imageAlt: 'a map',
    isLoading: false,
  };

  // want to respond to arrow keys (pan), +/- (zoom) and L/R (rotate) when hovering over img
  // mouse movement and button release may happen outside the boundary of the img
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('click', this.handleMouseUp, false);
    document.addEventListener('touchend', this.handleTouchEnd, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);
    document.removeEventListener('click', this.handleMouseUp, false);
    document.removeEventListener('touchend', this.handleTouchEnd, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
  }

  handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 2) { // zoom
      const touchDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY,
      );
      this.setState({
        isMouseDown: false, // cancel pan
        touchZoomReferenceDistance: touchDistance,
      });
    } else { // pan, handle like mouse click and drag
      const touchPoint = e.touches[0];
      this.setState({
        isMouseDown: true,
        mouseX: touchPoint.clientX,
        mouseY: touchPoint.clientY,
      });
    }
  }

  handleTouchMove = (e) => {
    const {
      isMouseDown,
      isTouchZoomingIn,
      isTouchZoomingOut,
      mouseX,
      mouseY,
      touchZoomReferenceDistance,
    } = this.state;
    const {
      handlePanImage,
      startZoomIn,
      endZoomIn,
      startZoomOut,
      endZoomOut,
      top,
      left,
    } = this.props;
    if (e.touches.length === 2) { // zoom
      const touchDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY,
      );
      const distanceMoved = touchDistance - touchZoomReferenceDistance;
      const TOUCH_ZOOM_TOLERANCE = 5; // need to investigate senstivity to this on different phones
      // if distance moved is below TOUCH_ZOOM_TOLERANCE do nothing so zoom isn't too fast
      if (distanceMoved > TOUCH_ZOOM_TOLERANCE) { // zoom in
        startZoomIn();
        if (isTouchZoomingOut) endZoomOut();
        this.setState({
          isTouchZoomingIn: true,
          isTouchZoomingOut: false,
          touchZoomReferenceDistance: touchDistance,
        });
      }
      if (distanceMoved < -TOUCH_ZOOM_TOLERANCE) { // zoom out
        startZoomOut();
        if (isTouchZoomingIn) endZoomIn();
        this.setState({
          isTouchZoomingIn: false,
          isTouchZoomingOut: true,
          touchZoomReferenceDistance: touchDistance,
        });
      }
    } else { // pan
      const touchPoint = e.touches[0];
      if (isMouseDown) {
        const dX = touchPoint.clientX - mouseX;
        const dY = touchPoint.clientY - mouseY;
        this.setState({
          mouseX: touchPoint.clientX,
          mouseY: touchPoint.clientY,
        });
        handlePanImage(top + dY, left + dX);
      }
    }
  }

  handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isMouseDown: true,
      mouseX: e.nativeEvent.clientX,
      mouseY: e.nativeEvent.clientY,
    });
  }

  handleMouseMove = (e) => {
    const {
      handlePanImage,
      top,
      left,
    } = this.props;
    const {
      isMouseDown,
      mouseX,
      mouseY,
    } = this.state;
    if (isMouseDown) {
      const dX = e.clientX - mouseX;
      const dY = e.clientY - mouseY;
      this.setState({
        mouseX: e.clientX,
        mouseY: e.clientY,
      });
      handlePanImage(top + dY, left + dX);
    }
  }

  handleMouseUp = () => {
    this.setState({
      isMouseDown: false,
    });
  }

  handleTouchEnd = () => {
    const {
      endZoomIn,
      endZoomOut,
    } = this.props;
    endZoomIn();
    endZoomOut();
    this.setState({
      isMouseDown: false,
    });
  }

  handleDoubleClick = () => {
    const { switchCourseRoute } = this.props;
    switchCourseRoute();
  }

  handleMouseOver = () => {
    this.setState({ isMouseOver: true });
  }

  handleMouseOut = () => {
    this.setState({ isMouseOver: false });
  }

  handleKeyDown = (e) => {
    const {
      startZoomIn,
      startZoomOut,
      startRotateLeft,
      startRotateRight,
    } = this.props;
    const {
      isKeyDown,
      isMouseOver,
      maxPanStep,
    } = this.state;
    if (isMouseOver) {
      const keyCode = e.code;
      if (!isKeyDown[keyCode]) {
        this.setState({
          isKeyDown: { ...isKeyDown, [keyCode]: true },
        });
      }
      switch (keyCode) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            this.panKeyboard(keyCode, 1, maxPanStep);
          }
          return true;
        case 'Equal':
        case 'NumpadAdd':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startZoomIn();
          }
          break;
        case 'Minus':
        case 'NumpadSubtract':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startZoomOut();
          }
          break;
        case 'KeyL':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startRotateLeft();
          }
          break;
        case 'KeyR':
        case 'KeyP':
          e.preventDefault();
          if (!isKeyDown[keyCode]) {
            startRotateRight();
          }
          break;
        default: // pass on event for normal handling by browser
          return false;
      }
    }
    return false; // ignore keyboard when not hovering over image to allow scrolling
  }

  handleKeyUp = (e) => { // reset when no longer holding down arrow key
    const {
      endZoomIn,
      endZoomOut,
      endRotateLeft,
      endRotateRight,
    } = this.props;
    const {
      isKeyDown,
    } = this.state;
    const keyCode = e.code;
    this.setState({
      isKeyDown: { ...isKeyDown, [keyCode]: false },
    });
    switch (keyCode) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        break;
      case 'Equal':
      case 'NumpadAdd':
        e.preventDefault();
        endZoomIn();
        break;
      case 'Minus':
      case 'NumpadSubtract':
        e.preventDefault();
        endZoomOut();
        break;
      case 'KeyL':
        e.preventDefault();
        endRotateLeft();
        break;
      case 'KeyR':
      case 'KeyP':
        e.preventDefault();
        endRotateRight();
        break;
      default: // pass on event for normal handling by browser
    }
  }

  panKeyboard = (arrowKey, step, maxStep) => {
    const {
      handlePanImage,
      left,
      top,
    } = this.props;
    const {
      isKeyDown,
      panTimeInterval,
    } = this.state;
    if (isKeyDown[arrowKey]) {
      let newTop = top;
      let newLeft = left;
      if (arrowKey === 'ArrowLeft') newLeft -= step;
      if (arrowKey === 'ArrowRight') newLeft += step;
      if (arrowKey === 'ArrowUp') newTop -= step;
      if (arrowKey === 'ArrowDown') newTop += step;
      handlePanImage(newTop, newLeft);
      const newStep = Math.min(step + 1, maxStep);
      setTimeout(() => this.panKeyboard(arrowKey, newStep, maxStep), panTimeInterval);
    }
  }

  render() {
    const {
      width,
      height,
      left,
      top,
      rotate,
      scale,
      imageSrc,
      imageAlt,
      isLoading,
      overlays,
    } = this.props;
    const imageClass = 'event-map-viewer-canvas-render__map-image';
    const imageStyle = {
      position: 'absolute',
      width: `${width}px`,
      height: `${height}px`,
      transform: `translateX(${(left) ? `${left}px` : 'auto'}) translateY(${top}px) scale(${scale}) rotate(${rotate}deg)`,
    };
    const overlaysToDisplay = (overlays.length > 0)
      ? (
        overlays.map((overlay, index) => {
          return (
            <img
              className={`event-map-viewer-canvas-render__overlay-${index + 1}`}
              key={overlay}
              src={overlay}
              alt="overlay"
              style={imageStyle}
              onMouseDown={this.handleMouseDown}
              onMouseOut={this.handleMouseOut}
              onBlur={this.handleMouseOut}
              onMouseOver={this.handleMouseOver}
              onFocus={this.handleMouseOver}
              onDoubleClick={this.handleDoubleClick}
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
            />
          );
        })
      )
      : null;
    const imgToDisplay = (imageSrc === '')
      ? null
      : (
        <div className="event-map-viewer-canvas-render__canvas">
          <img
            className={imageClass}
            style={imageStyle}
            src={imageSrc}
            alt={imageAlt}
            onMouseDown={this.handleMouseDown}
            onMouseOut={this.handleMouseOut}
            onBlur={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
            onFocus={this.handleMouseOver}
            onDoubleClick={this.handleDoubleClick}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
          />
          {overlaysToDisplay}
        </div>
      );
    return (isLoading)
      ? (
        <div className="ui segment event-map-viewer-canvas-render__loader">
          <div className="ui active dimmer">
            <div className="ui medium text loader">Loading...</div>
          </div>
        </div>
      )
      : imgToDisplay;
  }
}

export default EventCourseMapCanvasRender;
