    import React from 'react';

const style = {
    width: '200px',
    height: '300px',
    backgroundColor: '#000',
    position: 'absolute',
};

const style2 = {
    height: '100vh',
    width: '100%',
    position: 'relative',
}

const url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

class VideoBox extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.isPlaying = false;
        this.state = {
            left: 0,
            top: 0,
            right: 'auto',
            bottom: 'auto',
            shiftX: 0,
            shiftY: 0,
            isDragging: false,
            isDragHappened: false,
        };
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount () {
        window.addEventListener("resize", this.onResize);
        window.addEventListener("mouseup", this.onDragEnd);
    }

    componentWillUnmount () {
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("mouseup", this.onDragEnd);
    }

    onVideoClick = () => {
        if (!this.state.isDragHappened) {
            this.isPlaying ? this.videoRef.current.pause() : this.videoRef.current.play();
            this.isPlaying = !this.isPlaying;
        }
    }

    onResize = () => {
        setTimeout(this.setPositionAfterDrop, 10);
    }

    onDragStart = (event) => {
        const shiftX = (event.clientX || event.touches[0].clientX) - this.videoRef.current.getBoundingClientRect().left;
        const shiftY = (event.clientY || event.touches[0].clientY) - this.videoRef.current.getBoundingClientRect().top;
        this.setState({
            left: (event.pageX || event.touches[0].pageX) - shiftX,
            top: (event.pageY || event.touches[0].pageY) - shiftY,
            right: 'auto',
            bottom: 'auto',
            shiftX,
            shiftY,
            isDragging: true,
            isDragHappened: false,
        });
    }

    onDrag = (event) => {
        if (this.state.isDragging) {
            if (this.isPlaying) {
                this.isPlaying = false;
                this.videoRef.current.pause();
            }
            this.setState(({ shiftX, shiftY }) => ({
                left: (event.pageX || event.touches[0].pageX) - shiftX,
                top: (event.pageY || event.touches[0].pageY) - shiftY,
                right: 'auto',
                bottom: 'auto',
                isDragHappened: true,
            }));
        }
    }

    onDragEnd = (event) => {
        this.setState({ isDragging: false }, this.setPositionAfterDrop);
    }

    setPositionAfterDrop = () => {
        const { top, left, right, bottom } = this.videoRef.current.getBoundingClientRect();
        const { innerHeight: parentHeight, innerWidth: parentWidth } = window;
        let newTop = 'auto';
        let newLeft = 'auto';
        let newRight = 'auto';
        let newBottom = 'auto';
        const rightAfterVideoEl = parentWidth - right;
        const bottomBelowVideoEl = parentHeight - bottom;
        if (left < rightAfterVideoEl) {
            newLeft = 0;
        } else {
            newRight = 0;
        }
        if (top < bottomBelowVideoEl) {
            newTop = 0;
        } else {
            newBottom = 0;
        }
        this.setState({ left: newLeft, top: newTop, right: newRight, bottom: newBottom });
    };

    render () {
        const { top, left, right, bottom } = this.state;
        return (
            <div style={style2}>
                <video
                    style={{...style, top, left, right, bottom}}
                    ref={this.videoRef}
                    onClick={this.onVideoClick}
                    onMouseMove={this.onDrag}
                    onMouseDown={this.onDragStart}
                    onMouseUp={this.onDragEnd}
                    onTouchStart={this.onDragStart}
                    onTouchEnd={this.onDragEnd}
                    onTouchMove={this.onDrag}
                >
                    <source src={url} type="video/mp4" />
                    <source src={url} type="video/ogg" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }
};

export default VideoBox;

