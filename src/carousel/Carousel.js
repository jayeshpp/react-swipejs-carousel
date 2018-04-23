import React from 'react';
import Hammer from "hammerjs";
import "../../style.css";

class Carousel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeSlide: 0,
            slides: [],
            hasVideo: true
        }
        this.handleThumbnail = this.handleThumbnail.bind(this);
    }


    slideTo(number) {
        if (number < 0)
            this.state.activeSlide = 0;
        else if (number > this.state.slideLength - 1)
            this.state.activeSlide = this.state.slideLength - 1
        else
            this.state.activeSlide = number;
        
            const selector = document.querySelector(".product-single-view");

        selector.classList.add('is-animating');
        var percentage = -(100 / this.state.slideLength) * this.state.activeSlide;
        selector.style.transform = 'translateX( ' + percentage + '% )';
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            selector.classList.remove('is-animating');
        }, 400);

        if(number >= 0 && number < this.state.slideLength) {
            const thumbs = Array.prototype.slice.call(document.querySelectorAll(".product-thumb-view .item"));
            thumbs.map(element=>{
                element.classList.remove("active");
            })
            thumbs[number].classList.add("active");
        }

    }

    onWindowResize() {
        let _self = this;
        window.addEventListener("resize", function(){ 
            _self.setElementWidth();
        });
    }

    translate (event) {
        
        let percentage = 100 / this.state.slideLength * event.deltaX / window.innerWidth;
        let percentageCalculated = percentage - 100 / this.state.slideLength * this.state.activeSlide;
        const selector = document.querySelector(".product-single-view");

        selector.style.transform = 'translateX( ' + percentageCalculated + '% )';

        if( event.isFinal ) {
            if( event.velocityX > 1 ) {
                this.slideTo( this.state.activeSlide - 1 );
            } else if( event.velocityX < -1 ) {
                this.slideTo( this.state.activeSlide + 1 )
            } else {
                if( percentage <= -( this.props.options.sensitivity / this.state.slideLength ) ) {
                    this.slideTo( this.state.activeSlide + 1 );

                } else if( percentage >= ( this.props.options.sensitivity / this.state.slideLength ) ) {
                    this.slideTo( this.state.activeSlide - 1 );
                } else { 
                    this.slideTo( this.state.activeSlide );
                }
            }
        }
    }

    handleThumbnail(e) {
        const index = parseInt(e.target.getAttribute("data-index"));
        this.slideTo(index);
    }

    
    componentDidMount() {
        this.setElementWidth();
        this.onWindowResize();
        this.setState({
            slideLength: this.props.children.length
        })
        let _self = this;
        const selector = document.querySelector(".product-single-view");
        
        let hammer = new Hammer.Manager(selector);
        hammer.add(new Hammer.Pan());
        
        hammer.on('pan', function(event) {
            _self.translate(event)
        });
        
    }

    setElementWidth() {
        const selector = document.querySelector(".product-single-view");
        selector.style.width = window.innerWidth * this.props.children.length + "px";

        Array.prototype.slice.call(selector.children).forEach(function(current, index, array) {
            current.style.width = window.innerWidth+"px";
        });
    }

    render() {
        
        return (
            <div className="product-gallery-wrapper product-swipe">
                <div className="product-single-view">
                {
                    this.props.children.map((response, index) => {
                        return (
                            <div key={index} className="item">
                                <img src={response.props.src}/>
                            </div>
                        )
                    })
                }
                </div>
                <div className="product-thumb-view">
                    {
                        this.props.children.map((response,index) => {
                            return (
                                <div className={`${index === 0 ? 'active' : ''} item`} key={index} data-index={index} onClick={this.handleThumbnail}>
                                    <img src={response.props.src}  data-index={index} alt="" width="70" height="70" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Carousel;