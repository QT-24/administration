import { useState } from 'react'
import { Col } from 'reactstrap';
import CommonRihoModalTitle from '../Common/CommonRihoModalTitle';
import { Btn, Image } from '../../../../../AbstractElements';
import { dynamicImage } from '../../../../../Service';
import { ClickOut } from '../../../../../utils/Constant';
import BalanceModal from './BalanceModal';

const ModalThird = () => {
  const [modalThird, setModalThird] = useState(false);
  const modalThirdToggle = () => setModalThird(!modalThird);
  return (
    <Col xl="4" md="12" className="custom-alert text-center">
      <div className="card-wrapper border rounded-3 h-100">
        <div className="Riho-demo-img">
          <CommonRihoModalTitle heading="Modal 3 -" subHeading="Balance Modal" text="Example of Riho dashboard balance card." />
          <div className="overflow-hidden balance-modal">
            <Image src={dynamicImage(`alert/balance.png`)} alt="learning" />
            <Btn color="primary" className="mx-auto mt-3" onClick={modalThirdToggle}>{ClickOut}</Btn>
          </div>
          <BalanceModal modalThird={modalThird} modalThirdToggle={modalThirdToggle} />
        </div>
      </div>
    </Col>
  )
}

export default ModalThird