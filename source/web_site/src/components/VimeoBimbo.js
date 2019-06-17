import React from 'react';
import {NavLink} from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import bimboLogo from './bimbo/logotipo.svg'
import './../styles/bimbo.css';
import {Container, Row, Col, Button, Alert} from 'reactstrap';

export default class VimeoBimbo extends React.Component {
  render() {
    const videoJsOptions = {
      autoplay: false,
      controls: true,
      sources: [{
        src: 'https://63050ee307b58b8f.mediapackage.us-east-1.amazonaws.com/out/v1/3c674342708140ca934c5c87f2fb0774/index.m3u8',
        type: 'application/x-mpegURL',
      }]
    };

    return (
      <div>
        <div className="header-line"></div>
        <div className="header">
          <div className="content">
            <a href="https://grupobimbo.com/es" className="logo">
              <img src={bimboLogo} height={50} />
            </a>
            <nav>
              <ul>
                <li><NavLink to="/bimbo-live" activeClassName="active">Live</NavLink></li>
                {/* <li><NavLink to="/live" activeClassName="active">Live</NavLink></li>
                <li><NavLink to="/" activeClassName="active" exact>Media</NavLink></li>
                <li><NavLink to="/collection" activeClassName="active">Collection</NavLink></li>
                <li><NavLink to="/settings" activeClassName="active">Settings</NavLink></li> */}
              </ul>
            </nav>
            {/* <div className="ml-auto d-flex align-items-center">
              <div className="filter-input">
                <input placeholder="Search videos, people, and more" />
                <i className="fa fa-search filter-button"></i>
              </div>
              <Button className="btn-bimbo btn-bimbo-primary">
                <i className="mr-2 fa fa-cloud-upload"></i>
                subir
              </Button>
            </div> */}
          </div>
        </div>
        <div className="main">
          {/* <div className="player-area">
            <VideoPlayer
              {...videoJsOptions}
            />
          </div> */}
          <div>
            <Container className="mt-3">
              <Row className="justify-content-md-center">
                <Col sm="7">
                <div className="player-area">
            <VideoPlayer
              {...videoJsOptions}
            />
          </div>
                  <div>
                    <h1 className="title line-height--1">PLANT BASED FOOD - Bimbo Ventures.</h1>
                    <div className="help">
                  <h3 className="line-height--1">Ayuda</h3>
                    Si desea modificar el idioma de los subtítulos, puede utilizar el control "cc" que se encuentra disponible en la sección inferior del reproductor.
                  </div>
                    {/* <p className="font-size--13">
                      <time datetime="2019-05-07 23:50:05" title="Tuesday, May 7, 2019 at 11:50 PM EST">1 month ago</time>
                      <a className="clip-info__more">Más</a>
                    </p>
                    <div className="clip-info__user">
                      <img src="https://i.vimeocdn.com/portrait/16631400_75x75.webp" className="clip-info__user-image" height={32} />
                      <span className="clip-info__user-name">craig anderson</span>
                      <Button className="btn-bimbo btn-bimbo-primary">+ Seguir</Button>
                    </div>
                    <hr />
                    <div className="keypad">
                      <div>
                        <span className="mr-2"><i className="mr-2 fa fa-play"></i> 88,2 K</span>
                        <span className="mr-2"><i className="mr-2 fa fa-heart"></i> 814</span>
                        <span className="mr-2"><i className="mr-2 fa fa-share-alt-square"></i> 37</span>
                        <span className="mr-2"><i className="mr-2 fa fa-comment"></i> 26</span>
                      </div>
                      <Button className="btn-bimbo btn-bimbo-grey"><i className="mr-2 fa fa-send">Compartir</i></Button>
                    </div>
                    <hr />
                    <div className="comments">
                      <h3>Deja el primer comentario:</h3>
                      <textarea placeholder="Agrega un nuevo comentario"></textarea>
                    </div> */}
                  </div>
                </Col>
                {/* <Col sm="4"> */}
                  
                  {/* <div>
                    <h3 className="line-height--1">Más de craig anderson</h3>
                    <div className="d-flex align-items-center">
                      <div className="position-relative mr-2">
                        <input type="checkbox" name="switch" id="switch" class="checkbox" />
                        <label for="switch" class="switch"></label>
                      </div>
                      <span className="line-height--1 font-size--13" >Reproduce el siguiente video automáticamente</span>
                    </div>
                    <div className="video-list">
                      <div className="video-list__item">
                        <div className="video-list__image">
                          <img />
                        </div>
                        <div className="video-list__text">
                          <p>Cuanto más...</p>
                          <span>craig anderson</span>
                        </div>
                      </div>
                      <div className="video-list__item">
                        <div className="video-list__image">
                          <img />
                        </div>
                        <div className="video-list__text">
                          <p>Bienvenido a otro...</p>
                          <span>craig anderson</span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                {/* </Col> */}
              </Row>
            </Container>
          </div>
        </div>

        <div className="footer">
        <Container>
          <div className="d-flex justify-content-between pb-4 pt-4">
          <div className="left">
            <div className="mb-3">
              <img src={bimboLogo} height={50} />
            </div>
            <ul>
              <li>Nuestras Marcas</li>
              <li>Sustentabilidad</li>
              <li>Noticias</li>
              <li>Nutrición y Bienestar</li>
              <li>Proveedores</li>
              <li>Únete a Nuestro Equipo</li>
            </ul>
          </div>
          <div className="center">
            <ul className="d-flex mb-3">
              <li className="social-network"><i className="fa fa-instagram"></i></li>
              <li className="social-network"><i className="fa fa-twitter"></i></li>
              <li className="social-network"><i className="fa fa-facebook"></i></li>
              <li className="social-network"><i className="fa fa-youtube-play"></i></li>
            </ul>
            <p className="d-flex flex-column mb-2">
              <span>Grupo Bimbo <strong>NO</strong> Solicita pagos</span>
              <span>en el proceso de selección.</span>
            </p>
            <p className="d-flex flex-column mb-2">
              <span>Sistema de Atención a Clientes y</span>
              <span>Consumidores del Grupo:</span>
              <a href="mailto:atencionenlinea@grupobimbo.com">atencionenlinea@grupobimbo.com</a>
            </p>
            <ul>
              <li><a href="https://grupobimbo.com/es/sitios-de-grupo-bimbo">Sitios de Grupo Bimbo</a></li>
              <li><a href="https://grupobimbo.com/es/conoce-sobre-grupo-bimbo">Conoce Sobre Grupo Bimbo</a></li>
              <li><a href="https://grupobimbo.com/es/contacto">Contacto</a></li>
            </ul>
          </div>
          <div className="right">
            {/* <div className="language-container">
              <select className="language">
                <option selected>Español</option>
                <option>Ingles</option>
              </select>
            </div> */}
            <a href="https://grupobimbo.com/es/inversionistas">
              <h6>
                Inversionistas
              </h6>
            </a>
          </div>
          </div>
          </Container>
        </div>
        <div className="footer-bottom">
          <ul>
            <li>Aviso de privacidad</li>
            <li>Términos y Condiciones</li>
            <li>Mapa de Sitio</li>
          </ul>
        </div>
      </div>
    );
  }
}
