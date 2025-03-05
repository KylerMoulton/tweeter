import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/userInfoHook";
import { AuthToken } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "../../presenters/PagedItemPresenter";

interface Props<TItem, TService> {
  presenterGenerator: (view: PagedItemView<TItem>) => PagedItemPresenter<TItem, TService>;
  itemRenderer: (item: TItem) => React.ReactNode;
}

const ItemScroller = <TItem, TService>({
  presenterGenerator,
  itemRenderer,
}: Props<TItem, TService>) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const [items, setItems] = useState<TItem[]>([]);
  const [newItems, setNewItems] = useState<TItem[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const { displayedUser, authToken } = useUserInfo();

  useEffect(() => {
    reset();
  }, [displayedUser]);

  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  useEffect(() => {
    if (newItems.length) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const listener: PagedItemView<TItem> = {
    addItems: (newItems: TItem[]) => setNewItems(newItems),
    displayErrorMessage,
    clearLastInfoMessage,
    displayInfoMessage,
  }

  const [presenter] = useState(() => presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
            {itemRenderer(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
