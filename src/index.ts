function component() {
  const element = document.createElement('div');

  element.innerHTML = "Hello TS"

  return element;
}

document.body.appendChild(component());