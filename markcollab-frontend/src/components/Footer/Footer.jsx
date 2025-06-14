import './Footer.css'
import React, { useState } from 'react';

const Footer = () => {

 // Estado para controlar o valor do checkbox
 const [isChecked, setIsChecked] = useState(false);
      
    // Função para lidar com a mudança do checkbox
 const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
 };

  // Estado para controlar o valor do input
  const [phoneNumber, setPhoneNumber] = useState('');

  // Função para lidar com a mudança do input
  const handleInputChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <div className='footer_container'>
        <div className='footer_containerA'>
            <h3 className='footer_h3'>Contate-nos</h3>
            <div>
             <h4 className='footer_h4'>Onde atuamos?</h4>
             <p className='footer_p'>Online - Hibrido | Pelo mundo todo!</p>
            </div>
            <div>
                <h4 className='footer_h4'>Contato</h4>
                <p className='footer_p'>81986400465</p>
            </div>
            <div>
                <h4 className='footer_h4'>Email</h4>
                <a href="mailto:atendimentomarkcollab@gmail.com" className='footer_a'>atendimentomarkcollab@gmail.com</a>
            </div>  
        </div>
        <div className='footer_containerA'>
            <h3 className='footer_h3'>Quer bater um papo e transformar seu negócio?</h3>
            <div>
                <p className='footer_p'>Deixe seu número e a gente te chama no whatsApp para conversar sobre as suas necessidades e como a podemos te ajudar a alcançar seus objetivos</p>
            </div>
            <div>
                <label htmlFor="footer_checkbox" className='checkbox_label'>
                    <input type="checkbox" name="checkbox" id="footer_checkbox_btn" checked={isChecked} onChange={handleCheckboxChange} /> Concordo com o processamento dos meus dados pessoais para fins de marketing  
                </label>
            </div>
            <div>
                <label htmlFor='footer_tel'className='tel_label'>
                    <input type="tel" placeholder= "Número do WhatsApp: *" value={phoneNumber} onChange={handleInputChange} maxLength="15" className='input_tel'/>
                </label>
            </div>
            <div className='footer_btn'>
                <button>Enviar</button>
            </div>
        </div>
    </div>
  )
}

export default Footer;