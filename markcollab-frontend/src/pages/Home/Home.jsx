import React from 'react'
import Footer from '../../components/Footer/Footer.jsx'
import './Home.css'
import img1 from '../../assets/img/meeting.png'
import img2 from '../../assets/img/fOTO.png'



const Home = () => {
  return (
    <div>
      <div className='home_container'>
        <div className='home_div1'>
          <div className='home_div1_1'>
            <h1 className='home_h1'>A equipe de marketing perfeita para o seu negócio!</h1>
            <p>Estamos aqui para simplificar os seus projetos de marketing e tecnologia da informação, proporcionando uma experiência sem estresse e resultados que realmente fazem a diferença.</p>
          </div>
          <div>
            <img src={img1} alt="Reunião de negócios" id='imagem1'/>
          </div>
        </div> 
        <div className='home_div2'>
          <div className='home_div2_divs1'>
           <img src={img2} alt="descricao da imagem" id='imagem2'/>
          </div>
          <div className='home_div2_divs2'>
            <h1 className='home_h1'>Por que escolher a MarkCollab? </h1>
            <p>Na MarkCollab, reunimos uma equipe de especialistas para criar soluções de marketing sob medida para sua empresa. Seja para desenvolver campanhas de social media, criar conteúdos, ou elaborar estratégias completas de marketing, estamos aqui para transformar suas ideias em projetos de sucesso. Nosso compromisso é entender a fundo suas necessidades, conectar você aos melhores profissionais e garantir que cada etapa do projeto seja executada com excelência. </p>
          </div>
        </div>
        <div className='home_div3'>
          <h1 className='home_h1'>Conheça nossos processos</h1>
          <div className='home_div3_divs'>
            <div className='home_div3_divs1'>
             <h3>Você nos conta seus projetos</h3>
             <p>Compartilhe conosco sua visão e objetivos. Queremos entender cada detalhe do seu  negócio e suas necessidades específicas.</p>
            </div>
            <div className='home_div3_divs1'>
              <h3>Entendemos sua necessidade</h3>
             <p>Analisamos suas demandas e desafios, criando uma estratégia personalizada  que se alinha perfeitamente com suas metas.</p>
            </div>
            <div className='home_div3_divs1'>
              <h3>Criamos a equipe perfeita!</h3>
              <p>Montamos uma equipe de especialistas dedicada  ao seu projeto e designamos um líder para garantir  a qualidade e o sucesso em cada etapa </p>
           </div>
          </div>
          
        </div>      
      </div>
      <Footer />
    </div>
 
  )
}

export default Home