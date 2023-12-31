import React, { useEffect, useState } from "react";
import "./PizzaCard.scss";
import { useAppDispatch } from "../../../../redux/store.ts";
import { Link } from "react-router-dom";
import { addPizzaToCart } from "../../../../redux/slices/cart/cartSlice.ts";
import { Tpizzas } from "../../../../redux/slices/pizzas/types.ts";
import { TcartItem } from "../../../../redux/slices/cart/types.ts";

type TpizzaCardProps = {
	info: Tpizzas;
};

export type Tobj = {
	title: string;
	count: number;
};

const PizzaCard: React.FC<TpizzaCardProps> = ({ info }): JSX.Element => {
	const { id, sizes, doughs, imgSrc, imgAlt, title, price } = info;

	const appDispatch = useAppDispatch();
	const [pizzaSize, setPizzaSize] = useState<string>(sizes[0]);
	const [pizzaDough, setPizzaDough] = useState<string>(doughs[0]);
	const [pizzaCount, setPizzaCount] = useState<number>(0);

	const response: string | null = localStorage.getItem(title);
	const data: Tobj = JSON.parse(response!);

	const obj: Tobj = {
		title: title,
		count: data ? data.count : pizzaCount,
	};

	useEffect(() => {
		if (data) {
			localStorage.setItem(
				`${title}`,
				JSON.stringify({
					title: title,
					count: data.count,
				}),
			);
		} else {
			localStorage.setItem(`${title}`, JSON.stringify(obj));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleAddPizzaToCart(): void {
		const item: TcartItem = {
			id,
			title,
			price,
			imgSrc,
			imgAlt,
			sizes: pizzaSize,
			doughs: pizzaDough,
			count: 1,
		};

		appDispatch(addPizzaToCart(item));
		setPizzaCount((prevPizzaCount) => (prevPizzaCount += 1));

		if (data) {
			localStorage.setItem(
				`${title}`,
				JSON.stringify({
					title: title,
					count: data.count + 1,
				}),
			);
		} else {
			localStorage.setItem(`${title}`, JSON.stringify(obj));
		}
	}

	function handleSetPizzaInfo(e: React.MouseEvent<HTMLLIElement, MouseEvent>, arr: string[]): void {
		const target = e.target as HTMLLIElement;

		switch (arr) {
			case sizes:
				if (sizes.some((size: string) => size === target.dataset.size)) {
					setPizzaSize(target.dataset.size || "");
				} else return;
				break;
			case doughs:
				if (doughs.some((dough: string) => dough === target.dataset.dough)) {
					setPizzaDough(target.dataset.dough || "");
				} else return;
				break;
			default:
				break;
		}
	}

	return (
		<div className="pizzaCard">
			<Link to={`/pizzaPage/${id}`}>
				<img src={imgSrc} alt={imgAlt} />
			</Link>

			<h3>{title}</h3>

			<div className="selector">
				<ul>
					{doughs.map((dough) => {
						return (
							<li
								key={crypto.randomUUID()}
								data-dough={dough}
								onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
									handleSetPizzaInfo(e, doughs);
								}}
								className={pizzaDough === dough ? "active" : ""}>
								{dough}
							</li>
						);
					})}
				</ul>

				<ul>
					{sizes.map((size: string) => {
						return (
							<li
								key={crypto.randomUUID()}
								data-size={size}
								onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
									handleSetPizzaInfo(e, sizes)
								}
								className={pizzaSize === size ? "active" : ""}>
								{size} sm
							</li>
						);
					})}
				</ul>
			</div>

			<div className="pizzaCardBottom">
				<p>price: {price} $</p>

				<button type="button" className="addButton" onClick={handleAddPizzaToCart}>
					<p>+ Add</p>
					<p>{obj.count}</p>
				</button>
			</div>
		</div>
	);
};

export default PizzaCard;
