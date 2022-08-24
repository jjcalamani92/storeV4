import React, { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Thumbs } from "swiper";
import Image from "next/image";
import { ImageProduct } from "../interfaces/ecommerceV1";

// interface Props {
// 	products: IProduct[];
// }
interface Props1 {
	homes: any;
}
interface Props2 {
	image: ImageProduct[];
}

interface Props {
	image: string[];
}

export const SwiperComponent: FC<Props> = ({ image }) => {
	return (
		<>
			<Swiper
				slidesPerView={1}
				spaceBetween={30}
				loop={true}
				pagination={{
					clickable: true
				}}
				navigation={false}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false
				}}
				modules={[Autoplay, Pagination, Navigation]}
				className="mySwiper"
			>
				{image.map((images, i) => (
					<SwiperSlide className="slide" key={i}>
						<Image
							src={`${images}`}
							width={500}
							height={600}
							objectFit="cover"
							alt=""
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};

export const SwiperDetail: FC<Props2> = ({ image }) => {
	const [activeThumb, setActiveThumb] = useState<any>(null);
	return (
		<div className="w-full">
			<Swiper
				slidesPerView={1}
				spaceBetween={30}
				centeredSlides={true}
				loop={image.length === 1 ? false : true}
				navigation={image.length === 1 ? false : false}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false
				}}
				pagination={{
					clickable: image.length === 1 ? false : true
				}}
				grabCursor={image.length === 1 ? false : true}
				thumbs={{ swiper: activeThumb }}
				modules={[Autoplay, Navigation, Pagination, Thumbs]}
				className="mb-2"
			>
				{image.map((data, i) => (
					<SwiperSlide key={i}>
						<Image
							src={data.src ? data.src : "https://res.cloudinary.com/dvcyhn0lj/image/upload/v1655217461/14.1_no-image.jpg_gkwtld.jpg"}
							width={500}
							height={500}
							layout="responsive"
							objectFit="cover"
							alt={data.alt ? data.alt : "description image"}
						/>
						{/* <img src={`${images}`} width="100%" alt="" /> */}
					</SwiperSlide>
				))}
			</Swiper>
			{
				image.length <= 3
					? null
					:
					(
						<Swiper
							onSwiper={setActiveThumb}
							slidesPerView={4}
							spaceBetween={10}
							loop={true}
							navigation={false}
							// thumbs={{swiper:activeThumb}}
							modules={[Navigation, Pagination, Thumbs]}
						>
							{image.map((data, i) => (
								<SwiperSlide key={i}  >
									{/* <img src={`${images}`} alt="" /> */}
									<div className="border">
										<Image
											src={data.src ? data.src : "https://res.cloudinary.com/dvcyhn0lj/image/upload/v1655217461/14.1_no-image.jpg_gkwtld.jpg"}
											width={500}
											height={500}
											layout="responsive"
											objectFit="cover"
											alt={data.alt ? data.alt : 'description image'}
										// className={ `${activeThumb ? 'border border-gray-900' : ''}`}
										// className="border border-gray-900"
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					)
			}
		</div>
	);
};

export const SwiperHome: FC<Props> = ({ image }) => {
	return (
		<>
			<Swiper
				slidesPerView={1}
				spaceBetween={30}
				loop={image.length === 1 ? false : true}
				pagination={{
					clickable: true
				}}
				navigation={false}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false
				}}
				modules={[Autoplay, Pagination, Navigation]}

			>
				{image.map((images, i) => (
					<SwiperSlide key={i}>
						{/* <LayoutHome /> */}
						{/* <Image
							src={`${images}`}
							width={500}
							height={600}
							objectFit="cover"
							alt=""
						/> */}
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};
interface SwiperPaginationDynamic{
	images: ImageProduct[]
}

export const SwiperPaginationDynamic:FC<SwiperPaginationDynamic> = ({images}) => {
	const [ src, setSrc ] = useState(images)
	return (
		<Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >

        {
					images ?

				images.map((data, i) => (
					<SwiperSlide key={i}>
						<Image
							src={data ? data.src : "https://res.cloudinary.com/dvcyhn0lj/image/upload/v1655217461/14.1_no-image.jpg_gkwtld.jpg"}
							width={800}
							height={800}
							// layout="responsive"
							objectFit="cover"
							alt={data ? data.alt : "description image"}
						/>
					</SwiperSlide>
				))
				:
				<SwiperSlide >
						<Image
							src={"https://res.cloudinary.com/dvcyhn0lj/image/upload/v1655217461/14.1_no-image.jpg_gkwtld.jpg"}
							width={800}
							height={800}
							// layout="responsive"
							objectFit="cover"
							alt={"description image"}
						/>
					</SwiperSlide>
				}
      </Swiper>
    
	)
}