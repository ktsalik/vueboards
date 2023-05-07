function initializeStoryCardDrag(boardElement, onChange) {
  let mouseDownPoint = { x: -1, y: -1 };
  let mouseDownStoryCard = null;

  const onStoryCardMouseDown = (e, column, index) => {
    const story = column.stories[index];
    const storyElement = boardElement.value.querySelector('.stories-list [id="story-' + story.id + '"]');

    if (!storyElement.classList.contains('open')) {
      mouseDownStoryCard = storyElement;
      mouseDownPoint = { x: e.clientX, y: e.clientY };
      const pos = storyElement.getBoundingClientRect();
      mouseDownPoint.offsetX = mouseDownPoint.x - pos.x;
      mouseDownPoint.offsetY = mouseDownPoint.y - pos.y;
    }
  };

  let draggingElement = null;
  let draggingElementParentParentNodeId = null;
  let draggingElementNewParentParentNodeId = null;
  
  const onWindowMouseMove = (e) => {
    if (mouseDownStoryCard && !draggingElement) {
      if (Math.abs(e.clientX - mouseDownPoint.x) > 5 || Math.abs(e.clientY - mouseDownPoint.y) > 5 && !draggingElement) {
        draggingElement = mouseDownStoryCard;
        draggingElementParentParentNodeId = draggingElement.parentNode.parentNode.id;

        const initialWidth = draggingElement.offsetWidth;
        const initialHeight = draggingElement.offsetHeight;
        draggingElement.style.position = 'fixed';
        draggingElement.style.zIndex = 999;
        draggingElement.style.width = initialWidth + 'px';

        const emptyCardPositionElement = document.createElement('div');
        emptyCardPositionElement.classList.add('empty-card-position-element');
        emptyCardPositionElement.style.width = initialWidth + 'px';
        emptyCardPositionElement.style.height = initialHeight + 'px';
        emptyCardPositionElement.style.backgroundColor = '#EEEEEE';
        emptyCardPositionElement.style.borderRadius = '5px';
        emptyCardPositionElement.style.margin = '8px 0';
        mouseDownStoryCard.parentNode.insertBefore(emptyCardPositionElement, mouseDownStoryCard);

        document.body.appendChild(draggingElement);
      }
    }

    if (draggingElement) {
      const y = e.clientY - mouseDownPoint.offsetY;
      const x = e.clientX - mouseDownPoint.offsetX;
      draggingElement.style.top = y + 'px';
      draggingElement.style.left = x + 'px';

      const boardsElements = Array.from(boardElement.value.querySelectorAll('.column'));
      let boardHovering = null;
      for (let i = 0; i < boardsElements.length; i++) {
        const pos = boardsElements[i].getBoundingClientRect();
        if (e.clientX >= pos.x &&
            e.clientY <= pos.x + pos.width &&
            e.clientY >= pos.y &&
            e.clientY <= pos.y + pos.height
        ) {
          boardHovering = boardsElements[i];
        }
      }

      if (boardHovering) {
        draggingElementNewParentParentNodeId = boardHovering.id;

        if (draggingElementNewParentParentNodeId === draggingElementParentParentNodeId) {
          document.querySelector('.empty-card-position-element').classList.add('d-none');
        } else {
          document.querySelector('.empty-card-position-element').classList.remove('d-none');
        }

        const storyCards = Array.from(boardHovering.querySelectorAll('.stories-list .Story'));
        let newCardPositionElement = document.querySelector('.new-card-position-element');
        if (!newCardPositionElement) {
          newCardPositionElement = document.createElement('div');
          newCardPositionElement.classList.add('new-card-position-element');
          newCardPositionElement.style.width = draggingElement.offsetWidth + 'px';
          newCardPositionElement.style.height = draggingElement.offsetHeight + 'px';
          newCardPositionElement.style.backgroundColor = '#EEEEEE';
          newCardPositionElement.style.borderRadius = '5px';
          newCardPositionElement.style.margin = '8px 0';
        }
        let foundPosition = false;
        for (let i = 0; i < storyCards.length; i++) {
          const pos = storyCards[i].getBoundingClientRect();
          if (e.clientY < pos.y + (pos.height / 2)) {
            foundPosition = true;
            boardHovering.querySelector('.stories-list').insertBefore(newCardPositionElement, storyCards[i]);
            break;
          }
        }

        if (!foundPosition) {
          boardHovering.querySelector('.stories-list').appendChild(newCardPositionElement);
        }
      } else {
        draggingElementNewParentParentNodeId = null;
        document.querySelector('.new-card-position-element')?.remove();
        document.querySelector('.empty-card-position-element').classList.remove('d-none');
      }
    }
  };

  function whichChild(element){
    let i = 0;
    while ((element = element.previousSibling) !== null) ++i;
    return i;
  }

  const onWindowMouseUp = (e) => {
    if (draggingElement) {
      // if (draggingElementNewParentParentNodeId) {
      //   boardElement.value.querySelector('#' + draggingElementNewParentParentNodeId + ' .stories-list').appendChild(draggingElement);
      // } else {
      //   boardElement.value.querySelector('#' + draggingElementParentParentNodeId + ' .stories-list').appendChild(draggingElement);
      // }

      const emptyCardPositionElement = document.querySelector('.empty-card-position-element');
      const newCardPositionElement = document.querySelector('.new-card-position-element');
      if (newCardPositionElement) {
        newCardPositionElement.parentNode.insertBefore(draggingElement, newCardPositionElement);
        newCardPositionElement.remove();
      } else {
        emptyCardPositionElement.parentNode.insertBefore(draggingElement, emptyCardPositionElement);
      }
      emptyCardPositionElement.remove();
      
      onChange({
        storyId: draggingElement.id.split('-')[1],
        fromColumnId: draggingElementParentParentNodeId.split('-')[1],
        toColumnId: draggingElementNewParentParentNodeId?.split('-')[1] || draggingElementParentParentNodeId.split('-')[1],
        position: whichChild(draggingElement),
      });

      draggingElement.removeAttribute('style');
      draggingElement = null;
      draggingElementParentParentNodeId = null;
    }

    mouseDownStoryCard = null;
  };

  return {
    onStoryCardMouseDown,
    onWindowMouseMove,
    onWindowMouseUp,
  };
}

export default initializeStoryCardDrag;